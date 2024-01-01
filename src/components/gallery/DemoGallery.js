import React from 'react';
import { Box } from '@mui/system';
import GalleryEntry from './GalleryEntry';
import compositionII from '../../assets/gallery-entries/composition_II.json';
import sonOfMan from '../../assets/gallery-entries/son_of_man.json';
import monaLisa from '../../assets/gallery-entries/mona_lisa.json';
import marilyn from '../../assets/gallery-entries/marilyn_diptych.json';
import drawingHands from '../../assets/gallery-entries/drawing_hands.json';
import greatWave from '../../assets/gallery-entries/the_great_wave.json';

function DemoGallery() {
  return (
    <Box>
      <GalleryEntry data={monaLisa} readOnly />
      <GalleryEntry data={drawingHands} readOnly />
      <GalleryEntry data={sonOfMan} readOnly />
      <GalleryEntry data={marilyn} readOnly />
      <GalleryEntry data={compositionII} readOnly />
      <GalleryEntry data={greatWave} readOnly />
    </Box>
  );
}

export default DemoGallery;
