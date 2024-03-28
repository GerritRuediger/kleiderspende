import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrierungSuccessComponent } from './registrierung-success.component';

describe('RegistrierungSuccessComponent', () => {
  let component: RegistrierungSuccessComponent;
  let fixture: ComponentFixture<RegistrierungSuccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistrierungSuccessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RegistrierungSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
