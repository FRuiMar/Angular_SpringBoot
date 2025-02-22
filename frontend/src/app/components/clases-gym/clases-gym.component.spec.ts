import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesGymComponent } from './clases-gym.component';

describe('ClasesGymComponent', () => {
  let component: ClasesGymComponent;
  let fixture: ComponentFixture<ClasesGymComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesGymComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasesGymComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
