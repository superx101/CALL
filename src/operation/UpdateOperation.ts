import UpdateManager from "../manager/UpdateManager";

export default class UpdateOperation {
    public static start(output: CommandOutput) {
        UpdateManager.updatePlugin(false);
    }
}