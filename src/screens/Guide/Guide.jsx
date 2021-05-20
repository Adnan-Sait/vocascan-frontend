import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import { SelectOptionWithFlag } from "../../Components/Form/Select/Select.jsx";
import Modal from "../../Components/Modal/Modal.jsx";
import SlideShow from "../../Components/SlideShow/SlideShow.jsx";
import GroupForm from "../../Forms/GroupForm/GroupForm.jsx";
import PackageForm from "../../Forms/PackageForm/PackageForm.jsx";
import VocabForm from "../../Forms/VocabForm/VocabForm.jsx";
import End from "./Pages/End/End.jsx";
import GroupDescription from "./Pages/GroupDescription/GroupDescription.jsx";
import PackageDescription from "./Pages/PackageDescription/PackageDescription.jsx";
import Start from "./Pages/Start/Start.jsx";
import VocabDescription from "./Pages/VocabDescription/VocabDescription.jsx";

import useSnack from "../../hooks/useSnack.js";

import "./Guide.scss";

const Guide = () => {
  const { t } = useTranslation();
  const { showSnack } = useSnack();
  const isFirstLogin = true; //useSelector((state) => state.login.firstLogin);
  const [show, setShow] = useState(isFirstLogin);

  const [canContinue, setCanContinue] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const [selectedGroup, setSelectedGroup] = useState(null);

  const [hasPackage, setHasPackage] = useState(false);
  const [hasGroup, setHasGroup] = useState(false);
  const [hasVocab, setHasVocab] = useState(false);

  const packageAdded = useCallback(
    (newPackage) => {
      setSelectedPackage({
        value: newPackage.id,
        label: (
          <SelectOptionWithFlag
            name={newPackage.name}
            foreignLanguageCode={newPackage.foreignWordLanguage}
            translatedLanguageCode={newPackage.translatedWordLanguage}
          />
        ),
      });
      showSnack("success", t("screens.firstStartup.savePackageSuccessMessage"));
      setHasPackage(true);
      setCanContinue(true);
    },
    [setCanContinue, showSnack, t]
  );

  const groupAdded = useCallback(
    (newGroup) => {
      setSelectedGroup({ value: newGroup.id, label: newGroup.name });
      showSnack("success", t("screens.firstStartup.saveGroupSuccessMessage"));
      setCanContinue(true);
      setHasGroup(true);
    },
    [setCanContinue, showSnack, t]
  );

  const vocabAdded = useCallback(() => {
    setHasVocab(true);
    showSnack("success", t("screens.firstStartup.saveVocabSuccessMessage"));
    setCanContinue(true);
  }, [setCanContinue, showSnack, t]);

  const onLoadPackageForm = useCallback(() => {
    if (!hasPackage) {
      setCanContinue(false);
    }
  }, [hasPackage, setCanContinue]);

  const onLoadGroupForm = useCallback(() => {
    console.log(hasGroup);
    if (!hasGroup) {
      setCanContinue(false);
    }
  }, [hasGroup, setCanContinue]);

  const onLoadVocabForm = useCallback(() => {
    console.log(hasVocab);
    if (!hasVocab) {
      setCanContinue(false);
    }
  }, [hasVocab, setCanContinue]);

  const onEnd = useCallback(() => {
    setShow(false);
  }, []);

  const guidePages = [
    <Start setCanContinue={setCanContinue} />,
    <PackageDescription setCanContinue={setCanContinue} />,
    <PackageForm
      onSubmitCallback={packageAdded}
      onLoad={onLoadPackageForm}
      canSave={!hasPackage}
    />,
    <GroupDescription setCanContinue={setCanContinue} />,
    <GroupForm
      fixedPackage
      selectedPackage={selectedPackage}
      onSubmitCallback={groupAdded}
      onLoad={onLoadGroupForm}
      canSave={!hasGroup}
    />,
    <VocabDescription setCanContinue={setCanContinue} />,
    <VocabForm
      onSubmitCallback={vocabAdded}
      packageId={selectedPackage?.value}
      groupId={selectedGroup?.value}
      onLoad={onLoadVocabForm}
      canSave={!hasVocab}
    />,
    <End setCanContinue={setCanContinue} />,
  ];

  if (!isFirstLogin) {
    return null;
  }

  return (
    <Modal
      open={show}
      onClose={() => setShow(false)}
      renderClose={false}
      closeOnEscape={false}
    >
      <SlideShow pages={guidePages} onEnd={onEnd} canContinue={canContinue} />
    </Modal>
  );
};

export default Guide;
