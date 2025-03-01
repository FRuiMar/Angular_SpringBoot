import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrenadorCreateComponent } from './entrenador-create.component';

describe('EntrenadorCreateComponent', () => {
  let component: EntrenadorCreateComponent;
  let fixture: ComponentFixture<EntrenadorCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrenadorCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrenadorCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
