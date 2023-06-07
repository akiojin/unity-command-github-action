import * as core from '@actions/core'
import * as exec from '@actions/exec'
import { UnityUtils, UnityCommandBuilder } from '@akiojin/unity-command'

async function Run()
{
	try {
		const builder = new UnityCommandBuilder()
			.SetBuildTarget(UnityUtils.GetBuildTarget())
			.SetProjectPath(core.getInput('project-directory'))
			.SetExecuteMethod(core.getInput('execute-method'))
			.SetLogFile(core.getInput('log-file'))

		if (!!core.getInput('additional-arguments')) {
			builder.Append(core.getInput('additional-arguments').split(' '))
		}
	
		const version = core.getInput('unity-version') ||
			await UnityUtils.GetCurrentUnityVersion(core.getInput('project-directory'))

		core.startGroup('Run Unity')
		await exec.exec(UnityUtils.GetUnityPath(version, core.getInput('install-directory')), builder.Build())
		core.endGroup()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

Run()
