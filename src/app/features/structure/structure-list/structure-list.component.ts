import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  output,
  signal,
} from '@angular/core';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as L from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { PaginatorModule } from 'primeng/paginator';
import { Structure } from '@app/core/models/structure.class';
import { StructureService } from '@app/core/services/structure.service';
import { StructureRowComponent } from '@app/features/structure/components/structure-row/structure-row.component';


interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-structure-list',
  templateUrl: './structure-list.component.html',
  styleUrls: ['./structure-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    StructureRowComponent,
    LeafletModule,
    PaginatorModule,
  ],
})
export class StructureListComponent {
  displayStructureView = output<number>();

  structures = signal<Structure[]>([]);

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
    private structureService: StructureService,
    private destroyRef: DestroyRef
  ) {}

  onMapReady(map: L.Map) {
    this.map = map; // Set the map reference
    this.itemsMarkers = L.featureGroup().addTo(this.map); // Initialize FeatureGroup and add to map
    this.loadStructures(); // Load structures after the map is ready
  }
  get layers(): L.Layer[] {
    return this.itemsMarkers ? this.itemsMarkers.getLayers() : [];
  }


  loadStructures() {
    this.structureService
      .getPaginatedStructures(this.page, this.rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.structures.set(data.items);
        this.itemCount = data.total; // Mettre à jour le nombre total d'items
        this.addMarkers(data.items); // Ajouter des marqueurs
        
      });
  }
  addMarkers(structures: Structure[]) {
    setTimeout(() => {
    
    // Clear existing markers first
    this.itemsMarkers.clearLayers(); 

    if (structures.length === 0) {
      // Optionally, if there are no structures, you can set a default position for the map
      this.map.setView(L.latLng(48.864716, 2.349014), 5); // Default view
      return; // Exit early if there are no structures
    }

    structures.forEach(structure => {
      if (!!structure.address) {
    
          const latitude = parseFloat(structure.address.latitude.toString());
          const longitude = parseFloat(structure.address.longitude.toString());

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
            <strong>${structure.name}</strong><br>
            ${structure.address.streetL1 || ''}<br>
            ${structure.address.city}, ${structure.address.postcode}
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
  this.map.fitBounds(bounds); // Fit map to bounds of markers
  this.map.invalidateSize(); // Invalidate size to ensure correct rendering
}

  onPageChange(event: PageEvent) {
    this.first = event.first;
    this.rows = event.rows;
    this.page = event.page + 1; // +1 parce que la pagination commence à 0
    this.loadStructures(); // Recharger les utilisateurs lors du changement de page
  }
}
