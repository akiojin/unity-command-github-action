# unity-command-github-action
This action executes the Unity command line.  
For more information about the Unity command line, please refer to the [official documentation][1].

## Usage
### Simple usage
```yml
- uses: akiojin/unity-command-github-action@v1
  with:
    build-target: 'iOS'
    project-directory: ${{ github.workspace }}
```

### Additional arguments
```yml
- uses: akiojin/unity-command-github-action@v1
  with:
    build-target: 'iOS'
    project-directory: ${{ github.workspace }}
    additional-arguments: '-v --param="Test"'
```

## Arguments
### Common
|Name|Required|Type|Default|Description|
|:--|:--|:--|:--|:--|
|additional-arguments|`false`|`string`|""|Specify additional required arguments.|
|build-target|`true`|`string`||Allows the selection of an active build target before loading a project.<br><br>Possible options are:<br>Standalone, Win, Win64, OSXUniversal, Linux, Linux64, LinuxUniversal, iOS, Android, Web, WebStreamed, WebGL, XboxOne, PS4, WindowsStoreApps, Switch, N3DS, tvOS.|
|execute-method|`false`|`string`|""|Execute the static method as soon as Unity opens the project, and after the optional Asset server update is complete.|
|log-file|`false`|`string`|`"-"`|Specify where Unity writes the Editor or Windows/Linux/OSX standalone log file.<br>To output to the console, specify "-" for the path name.<br>On Windows, specify - option to make the output go to stdout, which is not the console by default.|
|project-directory|`true`|`string`||Open the project at the given path. If the pathname contains spaces, enclose it in quotes.|
|unity-version|`false`|`string`|""|Specify the Unity version to be used.<br>If omitted, the project version is used.|


## License
Any contributions made under this project will be governed by the [MIT License][3].

[0]: https://github.com/akiojin/unity-command-github-action/actions/workflows/Test.yml/badge.svg
[1]: https://docs.unity3d.com/2021.2/Documentation/Manual/EditorCommandLineArguments.html
[2]: https://github.com/akiojin/unity-command-github-action/blob/main/action.yml
[3]: https://github.com/akiojin/unity-command-github-action/blob/main/LICENSE