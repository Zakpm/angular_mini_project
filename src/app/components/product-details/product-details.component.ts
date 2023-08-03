// import { Component, OnInit, Input } from '@angular/core';
// import { Product } from 'src/app/models/product.model';
// import { ActivatedRoute } from '@angular/router';
// import { ProductService } from 'src/app/services/product.service';
// import { Flavor } from '../core/flavor';
// import { Size } from '../core/size';
// import { SelectedProductAttributes } from '../core/selectedProductAttributes';

// @Component({
//   selector: 'app-product-details',
//   templateUrl: './product-details.component.html',
//   styleUrls: ['./product-details.component.scss']
// })
import { Component, OnInit, Input } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  // Par défaut, aucune propriété de composant ne peut être modifiée par Property Binding. Il faut donc définir les propriétés pouvant servir d' "input" au composant en ajoutant simplement le décorateur @Input().
  @Input() viewMode = false;
  @Input() currentProduct: Product = {
    title: '',
    imageUrls: '',
    price: '',
    flavors: '',
    sizes: '',
    published: false
  };

  message = '';

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (!this.viewMode) {
      this.message = '';
      this.getProduct(this.route.snapshot.params['id']);
    }
  }

  getProduct(id: string): void {
    this.productService.get(id).subscribe({
      // next: function(data) {} Equivalent à
      next: (data) => {
        this.currentProduct = data;
        console.log(data);
      },
      error: (err) => console.error()
    });
  }

  updateProduct(): void {
    this.message = '';
    this.productService.update(this.currentProduct.id, this.currentProduct).subscribe({
      next: (response) => {
        console.log(response);
        this.message = response.message ? response.message : 'This tutorial was updated successfully!'
        this.router.navigate(['/products']);
      },
      error: (err) => console.error(err)
    });
  }

  updateProductPublished(status: boolean): void {
    const data = {
      name: this.currentProduct.title,
      imageUrls: this.currentProduct.imageUrls,
      price: this.currentProduct.price,
      flavors: this.currentProduct.flavors,
      sizes: this.currentProduct.sizes,
      published: status
    };

    this.message = '';

    this.productService.update(this.currentProduct.id, data).subscribe({
      next: (response) => {
        console.log(response);
        this.currentProduct.published = status;
        this.message = response.message ? response.message : 'The status was updated successfully!'
      },
      error: (err) => console.error(err)
    });
  }

  deleteProduct(): void {
    this.productService.delete(this.currentProduct.id).subscribe({
      next: (response) => {
        console.log(response);
        this.router.navigate(['/tutorials']);
      },
      error: (err) => console.error(err)
    });
  }
}

