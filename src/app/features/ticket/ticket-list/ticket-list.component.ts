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
import { Ticket } from '@app/core/models/ticket.class';
import { TicketService } from '@app/core/services/ticket.service';
import { TicketRowComponent } from '../components/ticket-row/ticket-row.component';

interface PageEvent {
  first?: number;
  rows?: number;
  page?: number;
  pageCount?: number;
}

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    TicketRowComponent,
    LeafletModule,
    PaginatorModule,
  ],
})
export class TicketListComponent {
  displayTicketView = output<number>();

  tickets = signal<Ticket[]>([]);

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
    private ticketService: TicketService,
    private destroyRef: DestroyRef
  ) {}

  onMapReady(map: L.Map) {
    this.map = map; // Set the map reference
    this.itemsMarkers = L.featureGroup().addTo(this.map); // Initialize FeatureGroup and add to map
    this.loadTickets(); // Load tickets after the map is ready
  }
  get layers(): L.Layer[] {
    return this.itemsMarkers ? this.itemsMarkers.getLayers() : [];
  }


  loadTickets() {
    this.ticketService
      .getPaginatedTickets(this.page, this.rows)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.tickets.set(data.items);
        this.itemCount = data.total; // Mettre à jour le nombre total d'items
        this.addMarkers(data.items); // Ajouter des marqueurs
        
      });
  }
  addMarkers(tickets: Ticket[]) {
    setTimeout(() => {
    
    // Clear existing markers first
    this.itemsMarkers.clearLayers(); 

    if (tickets.length === 0) {
      // Optionally, if there are no tickets, you can set a default position for the map
      this.map.setView(L.latLng(48.864716, 2.349014), 5); // Default view
      return; // Exit early if there are no tickets
    }

    tickets.forEach(ticket => {
      if (!!ticket.author.address) {
    
          const latitude = parseFloat(ticket.author.address.latitude.toString());
          const longitude = parseFloat(ticket.author.address.longitude.toString());

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
            <strong>${ticket.author.firstname} ${ticket.author.lastname}</strong><br>
            ${ticket.author.address.streetL1 || ''}<br>
            ${ticket.author.address.city}, ${ticket.author.address.postcode}
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
    this.loadTickets(); // Recharger les utilisateurs lors du changement de page
  }
}
