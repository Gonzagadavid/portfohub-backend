import Professional from "../../model/Professional.js";

const professionalModel = new Professional();

export default async function professional(userId, info) {
  await professionalModel.createProfessionalInfo({ userId, info });
}
