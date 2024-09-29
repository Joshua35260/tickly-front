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
import { tileLayer, latLng, Map, FeatureGroup } from 'leaflet';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

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
  ],
})
export class UserListComponent implements OnInit, AfterViewInit {
  displayUserView = output<number>();
  
  users = signal<User[]>([]);

  mapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        // attribution: '',
      }),
    ],
    circleMarkerOptions: {
      radius: 10,
      fillColor: '#ff0000',
      color: '#000',
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    },
    zoom: 5,
    center: latLng(48.864716, 2.349014),
  };
  private map!: L.Map
  itemsMarkers: FeatureGroup[] = [];
  constructor(
    private userService: UserService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService
      .getPaginatedUsers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.users.set(data.items);
        console.log('users :',data);
      });
  }

  ngAfterViewInit() {
    // this.addMarkers();
    // this.centerMap();
  }





  // private addMarkers() {
  //   // Add your markers to the map
  //   this.markers.forEach(marker => marker.addTo(this.map));
  // }

  // private centerMap() {
  //   // Create a LatLngBounds object to encompass all the marker locations
  //   const bounds = L.latLngBounds(this.markers.map(marker => marker.getLatLng()));
    
  //   // Fit the map view to the bounds
  //   this.map.fitBounds(bounds);
  // }
}
