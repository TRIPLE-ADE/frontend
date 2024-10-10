import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators";
import "../../../layouts/hass-subpage";

import "../../../components/ha-alert";

import { SubscribeMixin } from "../../../mixins/subscribe-mixin";
import type { HomeAssistant } from "../../../types";
import { BackupContent, fetchBackupDetails } from "../../../data/backup";

@customElement("ha-config-backup-details")
class HaConfigBackupDetails extends SubscribeMixin(LitElement) {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ type: Boolean }) public narrow = false;

  @state() private _backup?: BackupContent | null;

  @state() private _error?: string;

  protected firstUpdated(changedProps) {
    super.firstUpdated(changedProps);
    this._fetchBackup();
  }

  protected render(): TemplateResult {
    if (!this.hass) {
      return html`:(`;
    }
    return html`
      <hass-subpage
        back-path="/config/backup/list"
        .hass=${this.hass}
        .narrow=${this.narrow}
        .header=${this._backup?.name || "Backup"}
      >
        <div class="content">
          ${this._error &&
          html`<ha-alert alert-type="error">${this._error}</ha-alert>`}
          ${this._backup === null
            ? html`<p>No backup found</p>`
            : this._backup
              ? html`<p>${this._backup.slug}</p>`
              : html`<ha-circular-progress active></ha-circular-progress>`}
        </div>
      </hass-subpage>
    `;
  }

  private async _fetchBackup() {
    const slug = "5f7437d2";
    try {
      this._backup = await fetchBackupDetails(this.hass, slug);
    } catch (err: any) {
      this._error = err?.message || "Could not fetch backup details";
    }
  }

  static styles = css`
    .content {
      padding: 28px 20px 0;
      max-width: 690px;
      margin: 0 auto;
      gap: 24px;
      display: grid;
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-config-backup-details": HaConfigBackupDetails;
  }
}
