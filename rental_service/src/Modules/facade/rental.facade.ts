import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import RentalFacadeInterface, { PlaceOrderFacadeInputDto, PlaceOrderFacadeOutputDto } from "./rental.facade.interface";

export default class RentalFacade implements RentalFacadeInterface{

    constructor(private placeOrderUsecase: UseCaseInterface){}

    addOrder(input: PlaceOrderFacadeInputDto): Promise<PlaceOrderFacadeOutputDto> {
        return this.placeOrderUsecase.execute(input)
    }
}