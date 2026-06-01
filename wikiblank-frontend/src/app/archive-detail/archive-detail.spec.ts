import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchiveDetail } from './archive-detail';

describe('ArchiveDetail', () => {
  let component: ArchiveDetail;
  let fixture: ComponentFixture<ArchiveDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchiveDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchiveDetail);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
