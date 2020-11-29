import React from 'react'
import PlayerContext from 'contexts/PlayerContext'
import axios from 'axios'

export default class PlayerProvider extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      toggleAudio: this.toggleAudio,
      stopAudio: this.stopAudio,
      toggleMute: this.toggleMute,
      muted: false,
      volume: 100,
      changeVolume: this.changeVolume,
      handleVolumeChange: this.handleVolumeChange,
      shuffle: false,
      toggleShuffle: this.toggleShuffle,
      repeat: false,
      toggleRepeat: this.toggleRepeat,
      currentTime: 0,
      duration: 0,
      handleLoadStart: this.handleLoadStart,
      handlePlay: this.handlePlay,
      handlePause: this.handlePause,
      handleProgress: this.handleProgress,
      handleTimeUpdate: this.handleTimeUpdate,
      handleAudioEnd: this.handleAudioEnd,
      secondsLoaded: 0,
      changeTime: this.changeTime,
      startTimeChange: this.startTimeChange,
      endTimeChange: this.endTimeChange,
      getTrackData: this.getTrackData,
      currentTrackId: 0,
      setCurrentTrackId: this.setCurrentTrackId,
      cancelTrackRequest: this.cancelTrackRequest
    }
  }

  toggleAudio = () => {
    switch (this.state.audioStatus) {
      case 'play':
        return this.audio().pause()
      case 'pause':
        return this.audio().play()
    }
  }

  handlePause = () => this.setState({ audioStatus: 'pause' })

  audio = () => document.getElementById('playerPanelAudio')

  handlePlay = () => this.setState({ audioStatus: 'play' })

  stopAudio = () => {
    this.setState({ audioStatus: 'stop' })

    this.resetCurrentTrack()

    this.audio().src = ''
  }

  resetCurrentTrack () {
    this.setState({
      currentTrack: null,
      currentTrackData: null,
      currentTrackId: null,
      currentTime: 0,
      secondsLoaded: 0
    })
  }

  toggleMute = () => {
    const muted = !this.state.muted

    this.audio().muted = muted

    this.setState({ ...{ muted } })
  }

  changeVolume = e => {
    const volume = parseInt(e.target.value)
    const muted = volume === 0

    this.audio().volume = volume / 100
    this.audio().muted = muted
  }

  handleVolumeChange = e => {
    const volume = Math.floor(e.target.volume * 100)
    const { muted } = e.target

    this.setState({ ...{ volume, muted } })
  }

  toggleShuffle = () => this.setState({ shuffle: !this.state.shuffle })

  toggleRepeat = () => {
    const repeat = !this.state.repeat

    this.audio().loop = repeat

    this.setState({ repeat: repeat })
  }

  handleLoadStart = () => {
    this.setState({ duration: 0, secondsLoaded: 0 })
  }

  handleProgress = e => {
    const secondsLoaded = this.secondsLoaded(e.target)
    const { duration } = e.target

    this.setState({ ...{ secondsLoaded, duration } })
  }

  secondsLoaded (audio) {
    const loaded = audio.buffered
    const indexLoaded = loaded.length - 1

    return loaded.end(indexLoaded)
  }

  handleTimeUpdate = e => {
    const { currentTime } = e.target

    this.setState({ ...{ currentTime } })
  }

  handleAudioEnd = e => {
    e.target.currentTime = 0

    this.audio().pause()
  }

  changeTime = e => (this.audio().currentTime = e.target.value)

  startTimeChange = () => {
    const audioStatusOnChange = this.state.audioStatus

    this.setState({ ...{ audioStatusOnChange } })
    this.audio().pause()
  }

  endTimeChange = () => {
    const { currentTime, audioStatusOnChange } = this.state

    this.audio().currentTime = currentTime
    this.audio()[audioStatusOnChange]()
  }

  getTrackData = ({ artistName, trackTitle, albumTitle, index = 0 }) => {
    this.request = axios.CancelToken.source()

    const query = `${artistName} ${trackTitle}`
    const url = '/vk/track'
    const params = { ...{ query, index } }
    const cancelToken = this.request.token
    const extra = { ...{ params, cancelToken } }

    const handleSuccess = resp => {
      const { track } = resp.data

      if (track) {
        const currentTrack = track
        const currentTrackData = {
          ...{ artistName, trackTitle, albumTitle, index }
        }

        this.setState({ ...{ currentTrack, currentTrackData } })

        this.audio().src = track.link
        this.audio().play()
      }

      return resp
    }

    return axios.get(url, extra).then(handleSuccess)
  }

  setCurrentTrackId = id => this.setState({ currentTrackId: id })

  cancelTrackRequest = () => this.request.cancel()

  render () {
    const { children } = this.props
    const value = this.state

    return (
      <PlayerContext.Provider {...{ value }}>{children}</PlayerContext.Provider>
    )
  }
}
