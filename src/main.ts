import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as fs from 'fs/promises'
import path from 'path'
import { UnityUtils, UnityCommandBuilder } from '@akiojin/unity-command'
import UnityBuildScriptHelper from './UnityBuildScriptHelper'

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

async function Execute(executeMethod: string): Promise<void>
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

    core.startGroup('Run Unity')
    await exec.exec(UnityUtils.GetUnityPath(version, core.getInput('install-directory')), builder.Build())
    core.endGroup()
}

async function GetExecuteMethod(): Promise<string>
{
	if (!core.getInput('execute-method')) {
		await GenerateUnityBuildScript()
		return 'unity_command_github_action.UnityBuildScript.OpenProject'
	} else {
		return core.getInput('execute-method')
	}
}

async function Run()
{
	try {
		await Execute(await GetExecuteMethod())
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

Run()
