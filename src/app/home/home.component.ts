import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productList!: any[];
  products: any[] = [];
  subTotal!: any;
  filteredItems: any[] = [];

  constructor(
    private product_service: ProductService,
    private router: Router
  ) {}

  
  ngOnInit() {
    this.product_service.getAllProducts().subscribe({
      next: (res: any) => {
        console.log(res);
        this.productList = res;
      },
      error: (error) => {
        alert(error);
      },
      complete: () => {
        console.log('Request Completed');
      },
    });

    this.product_service.loadCart();
    this.products = this.product_service.getProduct();
  }

  //Add product to Cart
  addToCart(product: any) {
    if (!this.product_service.productInCart(product)) {
      product.quantity = 1;
      this.product_service.addToCart(product);
      this.products = [...this.product_service.getProduct()];
      this.subTotal = product.price;
    }
  }

  //Remove a Product from Cart
  removeFromCart(product: any) {
    this.product_service.removeProduct(product);
    this.products = this.product_service.getProduct();
  }

  //Calculate Total
  get total() {
    return this.products?.reduce(
      (sum, product) => ({
        quantity: 1,
        price: sum.price + product.quantity * product.price,
      }),
      { quantity: 1, price: 0 }
    ).price;
  }

  checkout() {
    localStorage.setItem('cart_total', JSON.stringify(this.total));
    this.router.navigate(['/payment']);
  }

  sortItems(): void {
    this.productList.sort((a, b) => a.name.localeCompare(b.name));
  }

  filterItems(name: string, category: string): void {
    this.filteredItems = this.productList.filter(item =>
      item.name.toLowerCase().includes(name.toLowerCase()) &&
      item.category.toLowerCase().includes(category.toLowerCase())
    );
  }
}
