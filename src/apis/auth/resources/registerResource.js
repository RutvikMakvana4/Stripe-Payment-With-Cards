

export default class RegisterResource {
    constructor(data) {
        this._id = data._id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.joiningDate = data.joiningDate;
        this.jobTitle = data.jobTitle;
        this.department = data.department;
    }
}