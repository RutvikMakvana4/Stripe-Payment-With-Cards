import { baseUrl } from "../../../common/constants/configConstants"

export default class CardsResource {
    constructor(card) {
        return card.map((data) => ({
            _id: data._id,
            fullName: data.fullName,
            last4: data.lastNumber,
            exp_month: data.expMonth,
            exp_year: data.expYear,
            card_type: data.brand,
            isDefault: data.isDefault,
            icon: baseUrl('cards/' + data.brand + '.png'),
        }))
    }
}