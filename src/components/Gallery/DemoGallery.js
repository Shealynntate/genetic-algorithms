import React from 'react';
import GalleryEntry from './GalleryEntry';
import Panel from '../settingsPanels/Panel';
import compositionII from '../../assets/gallery-entries/composition_II.json';
import sonOfMan from '../../assets/gallery-entries/son_of_man.json';
import monaLisa from '../../assets/gallery-entries/mona_lisa.json';

function DemoGallery() {
  return (
    <Panel label="Demo Runs">
      <GalleryEntry data={compositionII} readOnly />
      <GalleryEntry data={sonOfMan} readOnly />
      <GalleryEntry data={monaLisa} readOnly />
    </Panel>
  );
}

export default DemoGallery;
