import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, FormArray, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-tournament',
  standalone: true,
  imports: [ CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './create-tournament.component.html',
  styleUrl: './create-tournament.component.css'
})
export class CreateTournamentComponent{
  tournamentForm: FormGroup;

  ngOnInit(): void {
    this.addType();  // เพิ่มประเภทการแข่งขันเริ่มต้น
  }

  constructor(private fb: FormBuilder) {
    this.tournamentForm = this.fb.group({
      userName: [{value: 'Jane2002', disabled: true}],
      firstName: [{value: 'Jane', disabled: true}],
      lastName: [{value: 'Doe', disabled: true}],
      phoneNumber: [{value: '0643029947', disabled: true}],
      email: [{value: 'JaneTourBadminton@gmail.com', disabled: true}],
      promoteImage: new FormControl(''),
      tourName: new FormControl(''),
      tourTagline: new FormControl(''),
      deadlineOfRegister: new FormControl(''),
      startTour: new FormControl(''),
      endTour: new FormControl(''),
      location: new FormControl(''),
      types: this.fb.array([]),
    });
  };

  types(): FormArray{
    return this.tournamentForm.get("types") as FormArray;
  };

  addType(){
    const type = this.fb.group({
      typename: new FormControl(''),
      participants: new FormControl(''),
      registFee: new FormControl(''),
      rule: new FormControl(''),
    });
    this.types().push(type);
  }

  removeType(index: number){
    this.types().removeAt(index);
  }

  /*จักการแสดงผลรูปภาพที่อินพุตเข้ามา*/
  imageSrc: string | ArrayBuffer | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.imageSrc = reader.result;
      reader.readAsDataURL(file);
    }
  }

  onSubmit(){
    console.log(this.tournamentForm.value)
  }
}
