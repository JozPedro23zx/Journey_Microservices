import RentalFacade from "../facade/rental.facade"
import ClientRepository from "../repository/repositories/client.repository"
import OrderRepository from "../repository/repositories/order.repository"
import ProductRepository from "../repository/repositories/product.repository"
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase"

export default class RentalFactoryFacade{
    static create(){
        const orderRepository = new OrderRepository()
        const productRepository = new ProductRepository()
        const clientRepository = new ClientRepository()
    
        const usecase = new PlaceOrderUseCase(clientRepository, productRepository, orderRepository)

        const facade = new RentalFacade(usecase)

        return facade
    }
}