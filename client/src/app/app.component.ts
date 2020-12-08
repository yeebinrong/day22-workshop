import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from './api.service';
import { CustomerDetails } from './models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  form:FormGroup;
  Orders:CustomerDetails[] = [];
  constructor(private fb:FormBuilder, private apiSvc: ApiService) { }

  ngOnInit(): void {
    this.createForm();
  }

  async onSubmit() {
    const id = this.form.value.id
    this.Orders = await this.apiSvc.getOrder(id)
    console.info(this.Orders)
  }

  // Generates the form
  private createForm () {
    this.form = this.fb.group({
      id: this.fb.control('', [Validators.required]),
    })
  }
}
