import React from 'react'
import { Container, Sidebar, Segment } from 'semantic-ui-react'
import PlayerContext from 'contexts/PlayerContext'
import AudioContainer from './audio/AudioContainer'
import Controls from './audio/Controls'
import TimeBarContextWrap from './audio/TimeBarContextWrap'
import Track from './Track'
import 'styles/global/Player.sass'

export default class Panel extends React.PureComponent {
  render () {
    const { currentTrack } = this.props

    const trackData = (
      <div className="playerPanelLeftColumn">
        <Track {...{ currentTrack }} />
      </div>
    )

    const audioContainerData = (
      <PlayerContext.Consumer>
        {context => {
          const {
            repeat,
            handleLoadStart,
            handlePlay,
            handlePause,
            handleProgress,
            handleTimeUpdate,
            handleVolumeChange,
            handleAudioEnd
          } = context
          const audioContainerProps = {
            repeat,
            handleLoadStart,
            handlePlay,
            handlePause,
            handleProgress,
            handleTimeUpdate,
            handleVolumeChange,
            handleAudioEnd
          }

          return <AudioContainer {...audioContainerProps} />
        }}
      </PlayerContext.Consumer>
    )

    const timeBarData = <TimeBarContextWrap />

    const audioData = (
      <div className="playerPanelRightColumn">
        {audioContainerData}
        <Controls />
        {timeBarData}
      </div>
    )

    const playerPanelContainer = currentTrack && (
      <Container className="playerPanelContainer">
        {trackData}
        {audioData}
      </Container>
    )

    return (
      <Sidebar
        as={Segment}
        visible={!!currentTrack}
        direction="bottom"
        animation="overlay"
        className="playerPanel"
      >
        {playerPanelContainer}
      </Sidebar>
    )
  }
}
