import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { User } from '@app/core/models/user.class';
import { UserRowComponent } from '../components/user-row/user-row.component';
import { UserService } from '@app/core/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PaginatorModule } from 'primeng/paginator';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    UserRowComponent,
    LeafletModule,
    PaginatorModule,
  ],
})
export class UserListComponent implements OnInit {
  displayUserView = output<number>();

  users = signal<User[]>([]);

  mapOptions = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }),
    ],
    zoom: 5,
    center: L.latLng(48.864716, 2.349014),
  };
  map!: L.Map;
  itemsMarkers!: L.FeatureGroup;

  first: number = 0;
  rows: number = 20;
  itemCount: number;
  page: number = 1;

  constructor(
    private userService: UserService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {

    
  }


  onMapReady(map: L.Map) {
    this.map = map; // Set the map reference
    this.itemsMarkers = L.featureGroup().addTo(this.map); // Initialize FeatureGroup and add to map
    this.loadUsers(); // Load users after the map is ready
  }
  get layers(): L.Layer[] {
    return this.itemsMarkers ? this.itemsMarkers.getLayers() : [];
  }


  loadUsers() {
    this.userService
      .getPaginatedUsers(this.page, this.rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.users.set(data.items);
        this.itemCount = data.total; // Mettre à jour le nombre total d'items
        this.addMarkers(data.items); // Ajouter des marqueurs
        
      });
  }
  addMarkers(users: User[]) {
    setTimeout(() => {
      

    // Clear existing markers first
    this.itemsMarkers.clearLayers(); 

    if (users.length === 0) {
      // Optionally, if there are no users, you can set a default position for the map
      this.map.setView(L.latLng(48.864716, 2.349014), 5); // Default view
      return; // Exit early if there are no users
    }

    users.forEach(user => {
      if (!!user.address) {
    
          const latitude = parseFloat(user.address.latitude.toString());
          const longitude = parseFloat(user.address.longitude.toString());

          // Create custom icon
          const customIcon = L.icon({
            iconUrl: 'images/images/marker-icon.png', 
            shadowUrl: 'images/images/marker-shadow.png',
            iconSize: [25, 41],
            shadowSize: [41, 41],
            iconAnchor: [12, 41],
            shadowAnchor: [12, 41],
            popupAnchor: [1, -34],
          });

          const marker = L.marker([latitude, longitude], { icon: customIcon }).bindPopup(`
            <strong>${user.firstname} ${user.lastname}</strong><br>
            ${user.address.street_l1 || ''}<br>
            ${user.address.city}, ${user.address.postcode}
          `);
            
          this.itemsMarkers.addLayer(marker); // Add marker to the existing FeatureGroup
        
      }
    });

    // Center the map only if markers are present
    if (this.itemsMarkers.getLayers().length > 0) {
      this.centerMap(); // Call centerMap after all markers are added
    }
  }, 100);
}
  

centerMap() {
  const bounds = this.itemsMarkers.getBounds();
  console.log(bounds);
  this.map.fitBounds(bounds); // Fit map to bounds of markers
  this.map.invalidateSize(); // Invalidate size to ensure correct rendering
}

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page + 1; // +1 parce que la pagination commence à 0
    this.loadUsers(); // Recharger les utilisateurs lors du changement de page
  }
}
