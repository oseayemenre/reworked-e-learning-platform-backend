export class MeetingEntity {
  public readonly _name;
  public readonly _meetingTime;
  public readonly _meetingId;
  public readonly _meetingDuration;

  constructor(
    _name: string,
    _meetingTime: Date,
    _meetingId: string,
    _meetingDuration: Date
  ) {
    this._name = _name;
    this._meetingTime = _meetingTime;
    this._meetingId = _meetingId;
    this._meetingDuration = _meetingDuration;
  }
}
