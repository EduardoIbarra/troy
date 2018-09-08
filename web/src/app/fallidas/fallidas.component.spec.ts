import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FallidasComponent } from './fallidas.component';

describe('FallidasComponent', () => {
  let component: FallidasComponent;
  let fixture: ComponentFixture<FallidasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FallidasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FallidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
