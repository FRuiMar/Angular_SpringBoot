import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesEditComponent } from './clases-edit.component';

describe('ClasesEditComponent', () => {
  let component: ClasesEditComponent;
  let fixture: ComponentFixture<ClasesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
