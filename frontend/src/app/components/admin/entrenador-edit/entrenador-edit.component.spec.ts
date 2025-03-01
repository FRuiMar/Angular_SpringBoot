import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenadorEditComponent } from './entrenador-edit.component';

describe('EntrenadorEditComponent', () => {
  let component: EntrenadorEditComponent;
  let fixture: ComponentFixture<EntrenadorEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrenadorEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrenadorEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
