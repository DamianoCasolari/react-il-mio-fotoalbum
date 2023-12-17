
/**
 * @type{import("express-validator").Schema}
 */
module.exports = {
    name: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Name is required"
        },
        isLength: {
            min: 2,
            max: 30,
            errorMessage: "The name can contain from 2 to 30 characters"
        },
        isString: true
    },
    description: {
        in: ["body"],
        notEmpty: {
            errorMessage: "Description is required"
        },
        isLength: {
            min: 2,
            max: 1500,
            errorMessage: "The name can contain from 2 to 1500 characters"
        },
        isString: true
    }
}