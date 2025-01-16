import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faHeart } from '@fortawesome/free-regular-svg-icons';
import { FakeStoreService } from '../fake-store.service';
import { Router } from '@angular/router';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-top-rating',
  standalone: true,
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './top-rating.component.html',
  styleUrl: './top-rating.component.css',
})
export class TopRatingComponent implements OnInit {
  star = faStar;
  heart = faHeart;
  solidHeart = solidHeart;
  regularHeart = regularHeart;
  products: any[] = [];

  constructor(private fakeStoreService: FakeStoreService, private router: Router) {}

  ngOnInit() {
    this.getProducts();
  }
  async getProducts() {
    try {
      const allProducts = await this.fakeStoreService.getAllProducts();
      const sortedProducts = allProducts.sort((a: any, b: any) => b.rating.rate - a.rating.rate);
      this.products = sortedProducts.slice(0, 8).map((product: any) => ({
        ...product,
        isInWishlist: this.fakeStoreService.isInWishlist(product.id)
      }));
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  generateStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, index) => rating > index);
  }

  getRatingClass(rating: number): string {
    if (rating >= 4) {
      return 'rating-good';
    } else if (rating >= 3) {
      return 'rating-medium';
    } else {
      return 'rating-bad';
    }
  }

  navigateToProducts() {
    this.router.navigate(['/products']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  async addToCart(event: Event, productId: number) {
    event.stopPropagation();
    try {
      const result = await this.fakeStoreService.addToCart(productId);
      if (result.success) {
        this.showToast('success', 'Added to Cart', 'Item added successfully!');
      } else {
        this.showToast('error', 'Error', 'Failed to add item to cart. Please try again.');
      }
    } catch (error) {
      console.error('Error adding item to cart:', error);
      this.showToast('error', 'Error', 'An unexpected error occurred. Please try again later.');
    }
  }

  async toggleWishlist(event: Event, product: any): Promise<void> {
    event.stopPropagation();
    try {
      if (product.isInWishlist) {
        await this.fakeStoreService.removeFromWishlist(product.id);
        product.isInWishlist = false;
        this.showToast('success', 'Removed from Wishlist', 'Item removed successfully!');
      } else {
        await this.fakeStoreService.addToWishlist(product.id);
        product.isInWishlist = true;
        this.showToast('success', 'Added to Wishlist', 'Item added successfully!');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      this.showToast('error', 'Error', 'Failed to update wishlist. Please try again.');
    }
  }

  private showToast(icon: 'success' | 'error', title: string, text: string): void {
    Swal.fire({
      icon,
      title,
      text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    });
  }
}
