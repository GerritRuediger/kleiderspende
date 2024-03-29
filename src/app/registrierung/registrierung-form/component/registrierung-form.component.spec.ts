import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrierungFormComponent } from './registrierung-form.component';

describe('RegistrierungFormComponent', () => {
  let component: RegistrierungFormComponent;
  let fixture: ComponentFixture<RegistrierungFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrierungFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrierungFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
