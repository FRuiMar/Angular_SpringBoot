import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiaCreateComponent } from './membresia-create.component';

describe('MembresiaCreateComponent', () => {
  let component: MembresiaCreateComponent;
  let fixture: ComponentFixture<MembresiaCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembresiaCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembresiaCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
