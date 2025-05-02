import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReadmesComponent } from './readmes.component';

describe('ReadmesComponent', () => {
  let component: ReadmesComponent;
  let fixture: ComponentFixture<ReadmesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ReadmesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReadmesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
