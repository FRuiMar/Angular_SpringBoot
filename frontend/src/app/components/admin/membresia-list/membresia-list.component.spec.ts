import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MembresiaListComponent } from './membresia-list.component';

describe('MembresiaListComponent', () => {
  let component: MembresiaListComponent;
  let fixture: ComponentFixture<MembresiaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MembresiaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MembresiaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
