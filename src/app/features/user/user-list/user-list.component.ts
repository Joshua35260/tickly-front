import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import { User } from '@app/core/models/user.class';
import { UserRowComponent } from '../components/user-row/user-row.component';
import { UserService } from '@app/core/services/user.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PaginatorModule } from 'primeng/paginator';
import { ListAndMapSearchComponent } from '@app/shared/common/list-and-map-search/list-and-map-search.component';
import {SearchType} from '@app/core/models/enums/search-type.enum';
import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { EmptyListComponent } from '@app/shared/common/layout/empty-list/empty-list.component';
import { WidgetComponent } from '@app/shared/common/widget/widget.component';
interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}
export interface ListAndMapSortOption {
  label: string;
  order?: string;
  filter: string;
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
    ListAndMapSearchComponent,
    DropdownModule,
    InputSwitchModule,
    EmptyListComponent,
    WidgetComponent,
  ],
})
export class UserListComponent implements OnInit {
  @ViewChild('scrollList') scrollList: ElementRef;
  displayUserView = output<number>();
  searchType = SearchType.USERS
  items = signal<User[]>([]);
  hideArchive = signal<boolean>(false);
  showMap: boolean = true;
  showCreateButton = signal<boolean>(true);
  sortOptions = signal<ListAndMapSortOption[]>([
    { label: 'Prenom (asc)', filter: 'user.first_name asc' },
    { label: 'Prenom (desc)', filter: 'user.first_name desc' },
    { label: 'Nom (asc)', filter: 'user.name asc' },
    { label: 'Nom (desc)', filter: 'user.name desc' },
  ]);
  selectedOptions = signal(this.sortOptions()[0]);
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
  ) {
    this.userService.entityChanged$ //reload items automatically on crud activity on this service
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loadItems();
      });
  }

  ngOnInit() {}
  onSearch(){

  }
  onDisplayNewItem() {

  }
  onSortChange(event) {
    
  }
  toggleShowArhive() {
    this.hideArchive.set(!this.hideArchive());
    this.loadItems();
  }
  onMapReady(map: L.Map) {
    this.map = map; // Set the map reference
    this.itemsMarkers = L.featureGroup().addTo(this.map); // Initialize FeatureGroup and add to map
    this.loadItems(); // Load items after the map is ready
  }
  get layers(): L.Layer[] {
    return this.itemsMarkers ? this.itemsMarkers.getLayers() : [];
  }

  loadItems() {
    this.userService
      .getPaginated(this.page, this.rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.items.set(data.items);
        this.itemCount = data.total; // Mettre à jour le nombre total d'items
        this.addMarkers(data.items); // Ajouter des marqueurs
      });
  }
  addMarkers(items: User[]) {
    setTimeout(() => {
      // Clear existing markers first
      this.itemsMarkers.clearLayers();

      if (items?.length === 0) {
        // Set a default position for the map
        this.map?.setView(L.latLng(48.864716, 2.349014), 5);
        return;
      }

      items.forEach((item) => {
        if (item.address && item.address.latitude && item.address.longitude) {
          const latitude = parseFloat(item.address.latitude.toString());
          const longitude = parseFloat(item.address.longitude.toString());

          // Vérifiez si latitude et longitude sont valides
          if (!isNaN(latitude) && !isNaN(longitude)) {
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

            const marker = L.marker([latitude, longitude], { icon: customIcon })
              .bindPopup(`
                        <strong>${item.firstname} ${item.lastname}</strong><br>
                        ${item.address.streetL1 || ''}<br>
                        ${item.address.city}, ${item.address.postcode}
                    `);

            this.itemsMarkers.addLayer(marker); // Add marker to the existing FeatureGroup
          } else {
            console.warn(
              `Invalid coordinates for item: ${item.firstname} ${item.lastname}`
            );
          }
        }
      });

      // Center the map only if markers are present
      if (this.itemsMarkers?.getLayers().length > 0) {
        this.centerMap(); // Call centerMap after all markers are added
      }
    }, 100);
  }

  centerMap() {
    const bounds = this.itemsMarkers?.getBounds();
    this.map?.fitBounds(bounds); // Fit map to bounds of markers
    this.map?.invalidateSize(); // Invalidate size to ensure correct rendering
  }

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page + 1; // +1 parce que la pagination commence à 0
    this.loadItems(); // Recharger les utilisateurs lors du changement de page
    this.scrollList.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
