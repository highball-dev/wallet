import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DutchPage } from './dutch.page';

describe('DutchPage', () => {
  let component: DutchPage;
  let fixture: ComponentFixture<DutchPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DutchPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DutchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
