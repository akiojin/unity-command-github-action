import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs/promises'
import path from 'path'
import { UnityUtils, UnityCommandBuilder } from '@akiojin/unity-command'
import UnityBuildScriptHelper from './UnityBuildScriptHelper'

function GetBuildTarget(): string
{
    const buildTarget = core.getInput('build-target')

    switch (buildTarget.toLowerCase()) {
    default:
        return buildTarget
    case 'ios':
    case 'iphone':
        return 'iPhone'
    case 'android':
        return 'Android'
    case 'windows':
    case 'win':
    case 'win64':
    case 'mac':
    case 'macos':
    case 'osx':
    case 'osxuniversal':
        return 'Standalone'
    }
}

async function ReplaceDefineSymbols(): Promise<void>
{
    const target = GetBuildTarget()
    const symbols = core.getInput('symbols')
    const filePath = `${core.getInput('project-directory')}/ProjectSettings/ProjectSettings.asset`
    const contents = await fs.readFile(filePath, 'utf-8')
    const updatedContents = []

    let reachedSection = false

    for (const line of contents.split('\n')) {
        const trim = line.trim()

        if (trim.startsWith('scriptingDefineSymbols:')) {
            reachedSection = true
        }

        if (reachedSection && trim.startsWith(`${target}:`)) {
            updatedContents.push(`${line};${symbols}`)
            reachedSection = false
        } else {
            updatedContents.push(line)
        }
    }

    await fs.writeFile(filePath, updatedContents.join('\n'), 'utf-8')
}

async function GenerateUnityBuildScript(): Promise<void>
{
    const script = UnityBuildScriptHelper.GenerateUnityBuildScript()
    const buildScriptName = 'UnityBuildScript.cs'
    const cs = path.join(core.getInput('project-directory'), 'Assets', 'Editor', buildScriptName)

    await fs.mkdir(path.dirname(cs), {recursive: true})
    await fs.writeFile(cs, script)

    core.startGroup(`Generate "${buildScriptName}"`)
    core.info(`${buildScriptName}:\n${script}`)
    core.endGroup()
}

async function Execute(title: string, executeMethod: string): Promise<void>
{
    const builder = new UnityCommandBuilder()
        .SetBuildTarget(UnityUtils.GetBuildTarget())
        .SetProjectPath(core.getInput('project-directory'))
		.SetExecuteMethod(executeMethod)
        .SetLogFile(core.getInput('log-file'))
        .EnablePackageManagerTraces()

    if (!!core.getInput('additional-arguments')) {
        builder.Append(core.getInput('additional-arguments'))
    }

    const version = core.getInput('unity-version') ||
        await UnityUtils.GetCurrentUnityVersion(core.getInput('project-directory'))

    core.startGroup(`Run ${title}`)
    const path = UnityUtils.GetUnityPath(version, core.getInput('install-directory'))
    await exec.exec(path, builder.Build())
    core.endGroup()
}

async function GetExecuteMethod(): Promise<string>
{
	if (!core.getInput('execute-method')) {
		return 'unity_command_github_action.UnityBuildScript.OpenProject'
	} else {
		return core.getInput('execute-method')
	}
}

async function Run()
{
	try {
		await GenerateUnityBuildScript()

        if (core.getInput('symbols')) {
            ReplaceDefineSymbols()
        }

		await Execute('Execute', await GetExecuteMethod())
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

Run()
