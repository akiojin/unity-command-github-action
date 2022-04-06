import * as core from '@actions/core'
import * as exec from '@actions/exec'
import * as os from 'os'
import { Unity, UnityCommandBuilder } from '@akiojin/unity-command'

async function Run()
{
	try {
		const builder = new UnityCommandBuilder()
			.SetBuildTarget(core.getInput('build-target'))
			.SetProjectPath(core.getInput('project-directory'))
			.SetExecuteMethod(core.getInput('execute-method'))
			.SetLogFile(core.getInput('log-file'))

		if (!!core.getInput('additional-arguments')) {
			builder.Append(core.getInput('additional-arguments').split(' '))
		}
	
		var version = core.getInput('unity-version')
	
		if (version === 'project') {
			version = await Unity.GetVersion(core.getInput('project-directory'))
		}

		core.startGroup('Run Unity')
		await exec.exec(Unity.GetExecutePath(os.platform(), version), builder.Build())
		core.endGroup()
	} catch (ex: any) {
		core.setFailed(ex.message)
	}
}

Run()
