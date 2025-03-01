import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasesCreateComponent } from './clases-create.component';

describe('ClasesCreateComponent', () => {
  let component: ClasesCreateComponent;
  let fixture: ComponentFixture<ClasesCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClasesCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClasesCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
