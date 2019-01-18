package entity;

public class Result {
    private Boolean success;
    private String Message;

    public Result() {
    }

    public Result(Boolean success, String message) {
        this.success = success;
        Message = message;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return Message;
    }

    public void setMessage(String message) {
        Message = message;
    }
}
