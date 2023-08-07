# unity-command-github-action

![Build][0]

This action is for executing a specific build script.
For more information about the Unity command line, please refer to the [official documentation][1].

This action also automatically generates a build script that does nothing but open the Unity project if an empty string is passed to `execute-method`.
This can only be used to check for compile errors.

## Usage

### Simple usage

In the following call to action, the program simply opens the project in iOS without passing any particular parameters.
This process will compile with the target set to iOS in Unity.

```yml
- uses: akiojin/unity-command-github-action@v1
  with:
    build-target: iOS
```

### Additional arguments

The following call to action calls the program `UnityBuildScript.PerformBuild` in the build script.
The parameter `-v --param="Test"` is passed when executing that build script.

```yml
- uses: akiojin/unity-command-github-action@v1
  with:
    build-target: iOS
    project-directory: ${{ github.workspace }}
    execute-method: UnityBuildScript.PerformBuild
    additional-arguments: -v --param="Test"
```

## Arguments

### Common

| Name                   | Required | Type     | Default           | Description                                                                                                                                                                                                                                                               |
| ---------------------- | -------- | -------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `additional-arguments` | `false`  | `string` | `""`              | Specify additional required arguments.                                                                                                                                                                                                                                    |
| `build-target`         | `true`   | `string` |                   | Allows the selection of an active build target before loading a project.<br><br>Possible options are:<br>Standalone, Win, Win64, OSXUniversal, Linux, Linux64, LinuxUniversal, iOS, Android, Web, WebStreamed, WebGL, XboxOne, PS4, WindowsStoreApps, Switch, N3DS, tvOS. |
| `execute-method`       | `false`  | `string` |                   | Execute the static method as soon as Unity opens the project, and after the optional Asset server update is complete.                                                                                                                                                     |
| `install-directory`    | `false`  | `string` | `""`              | If the Unity installation location is not the default, specify the path in this parameter.<br>The path must exclude the version number.<br>ex) E:\Unity\                                                                                                                  |
| `log-file`             | `false`  | `string` | `"-"`             | Specify where Unity writes the Editor or Windows/Linux/OSX standalone log file.<br>To output to the console, specify "-" for the path name.<br>On Windows, specify - option to make the output go to stdout, which is not the console by default.                         |
| `project-directory`    | `false`  | `string` | $GITHUB_WORKSPACE | Open the project at the given path.                                                                                                                                                                                                                                       |
| `unity-version`        | `false`  | `string` | `""`              | Specify the Unity version to be used.<br>If omitted, the project version is used.                                                                                                                                                                                         |

## License

Any contributions made under this project will be governed by the [MIT License][3].

[0]: https://github.com/akiojin/unity-command-github-action/actions/workflows/Build.yml/badge.svg
[1]: https://docs.unity3d.com/2022.3/Documentation/Manual/EditorCommandLineArguments.html
[2]: https://github.com/akiojin/unity-command-github-action/blob/main/action.yml
[3]: https://github.com/akiojin/unity-command-github-action/blob/main/LICENSE