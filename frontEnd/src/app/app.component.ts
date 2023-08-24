import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventServiceService } from './service/event-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  eventForm: FormGroup;
  queryForm: FormGroup;
  events: any[] = [];
  filteredEvents: any[] = [];
  searchTerm: string = '';

  constructor(private formBuilder: FormBuilder, private eventService: EventServiceService) {
    this.eventForm = this.formBuilder.group({
      event_type: ['', Validators.required],
      description: ['', Validators.required]
    });
    this.queryForm = this.formBuilder.group({
      event_type: [''],
      start_date: [''],
      end_date: ['']
    });
  }

  ngOnInit() {
    this.onSubmit2();
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      console.log(eventData);
      this.eventService.registerEvent(eventData).subscribe(
        response => {
          console.log(response);
          window.location.reload();
        },
        error => {
          console.error(error);
        }
      );
    }
  }

  onSubmit2() {
    const queryParams = this.queryForm.value;
    this.eventService.queryEvents(queryParams).subscribe(
      response => {
        this.events = response;
        this.filteredEvents = [...this.events];
      },
      error => {
        console.error('Error al consultar los eventos', error);
      }
    );
  }

  selectedEventType: string = '';

  setSelectedEventType(type: string) {
    console.log(type);
    this.selectedEventType = type;
  }

  filterByType() {
    if (this.selectedEventType) {
      this.filteredEvents = this.events.filter(event => event.event_type === this.selectedEventType);
    } 
    else if(this.selectedEventType == ''){
      this.filteredEvents = [...this.events]
    }
    else {
      this.filteredEvents = [...this.events];
    }
  }


  filterByDate() {
    const startDateInput = document.getElementById('start_date') as HTMLInputElement;
    const endDateInput = document.getElementById('end_date') as HTMLInputElement;
  
    if (startDateInput && endDateInput) {
      const startDate = startDateInput.value;
      const endDate = endDateInput.value;
  
      if (startDate && endDate) {
        const startDateTime = new Date(startDate).getTime();
        const endDateTime = new Date(endDate).getTime();
  
        this.filteredEvents = this.events.filter(event => {
          const eventDateTime = new Date(event.event_date).getTime();
          return eventDateTime >= startDateTime && eventDateTime <= endDateTime;
        });
      } else {
        this.filteredEvents = [...this.events];
      }
    }
  }
}
