export const filteredUser = () => {
    const excludedFields = [
        "password",
        "confirmPassword",
        "passwordChangeDate",
        "__v",
        "passwordResetToken",
        "passwordResetTokenExpires"
    ];
    return excludedFields.map(field => `-${field}`).join(" ");
};
