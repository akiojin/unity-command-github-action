export default class UnityBuildScriptHelper
{
    static GenerateUnityBuildScript(symbols?: string)
    {
        return `namespace unity_command_github_action
{
    using System.Linq;
    using UnityEditor;
    using UnityEditor.Build;

    public class UnityBuildScript
    {
        static void PreOpen()
        {
            var target = NamedBuildTarget.FromBuildTargetGroup(EditorUserBuildSettings.selectedBuildTargetGroup);
            var strings = $"{PlayerSettings.GetScriptingDefineSymbols(target)};${symbols}";
            var symbols = strings.Split(';').Where(s => !string.IsNullOrEmpty(s)).Distinct().ToArray();

            PlayerSettings.SetScriptingDefineSymbols(target, string.Join(";", symbols));

            EditorApplication.Exit(0);
        }

        static void OpenProject()
            => EditorApplication.Exit(0);
    }
}`;
    }
}