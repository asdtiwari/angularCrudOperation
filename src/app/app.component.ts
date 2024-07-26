import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crudOperation';

  /* url of array of json object which is in present in json-server file */
  /* I have created a repo named angularCrudOperationJsonServer and Uploaded 
  it to glitch.com and make share. So it is working as a json server for this application*/
  url = "https://classy-repeated-universe.glitch.me/persons";

  
  /* to store the reference of json-server file */
  db: any;

  /* retrieving the data from json-server file */
  constructor(private http: HttpClient) {
    this.http.get(this.url).subscribe(dataFromjson => {
      this.db = dataFromjson;
    })
  }

  /* varaibles are created to perform [(ngModel)] 2 way binding */
  nameTemplate: any;
  emailTemplate: any;
  phoneTemplate: any;

  /* to upload the data in json-server file */
  uploadData(formData: any) {
    this.http.post(this.url, formData.value).subscribe(result => {
      this.db.push(result);
    })
  }

  /* varaibles are created to perform [(ngModel)] 2 way binding */
  /* updateRequest variable is used to switch the behaviour of single form for data uploading and updating both */
  updateRequest: boolean = false;
  /* index variable will store the index of element of array of json-object which is present in json-server */
  index: any;
  /* a default id is generated by json-server for each element that will store in eleId variable */
  eleId: any;

  /* to update the data of json-server file */
  updateData(element: any) {
    /* When ever the updateData() will be called because of the updateRequest variable the submit button of form will become upade button and form will redirect to modifyData() instead of uploadData */
    this.updateRequest = true;    
    /* below five lines will track the element of which updation is requested and send to form's field */
    this.nameTemplate = element.name;
    this.phoneTemplate = element.phone;
    this.emailTemplate = element.email;
    this.eleId = element.id;
    this.index = this.db.indexOf(element);
  }

  /* final modification will be done using modifyData method as user click the modify button */
  modifyData(formData: any) {
    this.http.put(this.url+"/"+this.eleId, formData.value).subscribe(()=>{
      this.db[this.index] = formData.value;
      /* There was a bug to solve that below one line code has been added */
      this.db[this.index]['id'] = this.eleId;
    })

    /* Again making the form normal for uploading data only */
    this.updateRequest = false;
  }

  /* to delete the data from the json-server */
  deleteData(element: any) {
    this.http.delete(this.url+"/"+element.id).subscribe(()=> {
      this.db.splice(this.db.indexOf(element), 1);
    })
  }
}
