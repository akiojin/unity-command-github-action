export default class UnityBuildScriptHelper
{
    static GenerateUnityBuildScript()
    {
        return `namespace unity_command_github_action
{
    using UnityEditor;
    using UnityEditor.Build;

    public class UnityBuildScript
    {
        static void OpenProject()
            => EditorApplication.Exit(0);
    }
}`;
    }
}