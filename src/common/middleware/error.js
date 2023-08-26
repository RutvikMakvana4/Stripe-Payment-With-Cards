import { validationError } from '../../../utils/response/responseCode';
import GeneralError from '../../common/exceptions/generalError';

const error = (error, req, res, next) => {
  if (error instanceof GeneralError) {
    return res.status(error.status).json({ message: error.message })
  }

  if (error && error.error && error.error.isJoi) {
    return res.status(validationError).json({
      status : "error",
      message: error.error.details[0].message,
    })
  }
}

module.exports = error