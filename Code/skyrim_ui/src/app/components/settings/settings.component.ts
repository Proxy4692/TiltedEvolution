import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { SettingService } from 'src/app/services/setting.service';
import { Sound, SoundService } from '../../services/sound.service';

export enum FontSize {
  XS = 'xs',
  S = 's',
  M = 'm',
  L = 'l',
  XL = 'xl'
}

export const fontSizeToPixels: Record<FontSize, string> = {
  [FontSize.XS]: '10px',
  [FontSize.S]: '12px',
  [FontSize.M]: '16px',
  [FontSize.L]: '18px',
  [FontSize.XL]: '20px',
}

export enum PartyAnchor {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
  BOTTOM_LEFT,
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {

  /* ### ENUMS ### */
  readonly PartyAnchor = PartyAnchor;

  readonly availableLanguages = this.translocoService.getAvailableLangs();
  readonly availableFontSizes: {id: FontSize, label: string}[] = [
    {id: FontSize.XS, label: 'COMPONENT.SETTINGS.FONT_SIZES.XS'},
    {id: FontSize.S, label: 'COMPONENT.SETTINGS.FONT_SIZES.S'},
    {id: FontSize.M, label: 'COMPONENT.SETTINGS.FONT_SIZES.M'},
    {id: FontSize.L, label: 'COMPONENT.SETTINGS.FONT_SIZES.L'},
    {id: FontSize.XL, label: 'COMPONENT.SETTINGS.FONT_SIZES.XL'}
  ]

  public settings = this.settingService.settings;
  public autoHideTime: number;
  public partyAnchor: PartyAnchor;
  public partyAnchorOffsetX: number;
  public partyAnchorOffsetY: number;
  public fontSize: FontSize;
  public maxFontSize = Object.values(FontSize).length - 1;
  public minFontSize = 0;

  @Output() public done = new EventEmitter<void>();
  @Output() public settingsUpdated = new EventEmitter<void>();

  constructor(
    private readonly settingService: SettingService,
    private readonly sound: SoundService,
    private readonly translocoService: TranslocoService,
  ) {
  }

  ngOnInit(): void {
    this.autoHideTime = this.settingService.getAutoHideTime();
    this.partyAnchor = this.settingService.getPartyAnchor();
  }

  onAutoHideTimeChange(time: number) {
    this.settingService.setAutoHideTime(time);
    this.autoHideTime = time;
    this.settingsUpdated.next();
  }

  onPartyAnchorChange(anchor: PartyAnchor) {
    this.settingService.setPartyAnchor(anchor);
    this.partyAnchor = anchor;
    this.settingsUpdated.next();
  }

  public autoHideTimeSelected(number: number): boolean {
    return this.settingService.getAutoHideTime() === number;
  }

  close() {
    this.done.next();
    this.sound.play(Sound.Ok);
  }

  @HostListener('window:keydown.escape', ['$event'])
  // @ts-ignore
  private activate(event: KeyboardEvent): void {
    this.close();
    event.stopPropagation();
    event.preventDefault();
  }
}
