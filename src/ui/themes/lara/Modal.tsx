import {Close} from '../standard/Icons';
import Dialog from '../../components/Dialog';
import {template} from '../../utils/template';
import {useManager, useTranslations} from '../../utils/hooks';
import {ModalComponent} from '../../components/types/Modal';
import PoweredByLink from '../../components/PoweredByLink';

interface LaraGlobalConsentActionsProps {
	onSave: () => void;
}

const LaraGlobalConsentActions = ({onSave}: LaraGlobalConsentActionsProps) => {
	const manager = useManager();
	const t = useTranslations();

	if (manager.areAllPurposesMandatory()) {
		return null;
	}

	return (
		<>
			<button
				type="button"
				className="orejime-Button orejime-Button--info orejime-PurposeToggles-button orejime-PurposeToggles-disableAll"
				aria-disabled={manager.areAllPurposesDisabled()}
				onClick={() => {
					manager.declineAll();
					onSave();
				}}
				data-testid="orejime-modal-disable-all"
			>
				{t.modal.declineAll}
			</button>

			<button
				type="button"
				className="orejime-Button orejime-Button--info orejime-PurposeToggles-button orejime-PurposeToggles-enableAll"
				aria-disabled={manager.areAllPurposesEnabled()}
				onClick={() => {
					manager.acceptAll();
					onSave();
				}}
				data-testid="orejime-modal-enable-all"
			>
				{t.modal.acceptAll}
			</button>
		</>
	);
};

const Modal: ModalComponent = ({
	isForced,
	needsUpdate,
	privacyPolicyUrl,
	onClose,
	onSave,
	children
}) => {
	const t = useTranslations();
	const handleDescriptionClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement | null;
		const link = target?.closest('a');

		if (link && link.getAttribute('target')?.toLowerCase() !== '_blank') {
			onClose();
		}
	};

	return (
		<Dialog
			isAlert={isForced}
			labelId="orejime-modal-title"
			overlayClassName="orejime-ModalOverlay"
			className="orejime-ModalWrapper"
			onRequestClose={onClose}
		>
			<div className="orejime-Modal" data-testid="orejime-modal">
				<div className="orejime-Modal-header">
					{isForced ? null : (
						<button
							title={t.modal.closeTitle}
							className="orejime-Modal-closeButton"
							type="button"
							onClick={onClose}
							data-testid="orejime-modal-close"
						>
							<Close title={t.modal.close} />
						</button>
					)}

					<h1 className="orejime-Modal-title" id="orejime-modal-title">
						{t.modal.title}
					</h1>

					<div className="orejime-Modal-description">
						{isForced && needsUpdate ? (
							<p className="orejime-Modal-description">
								<strong className="orejime-Modal-changes">
									{t.misc.updateNeeded}
								</strong>
							</p>
						) : null}

						{t.modal.descriptionHtml ? (
							<p
								className="orejime-Modal-description"
								onClick={handleDescriptionClick}
								dangerouslySetInnerHTML={{
									__html: t.modal.descriptionHtml
								}}
							/>
						) : (
							<p className="orejime-Modal-description">
								{template(t.modal.description, {
									privacyPolicy: (
										<a
											key="privacyPolicyLink"
											className="orejime-Modal-privacyPolicyLink"
											onClick={() => {
												onClose();
											}}
											href={privacyPolicyUrl}
										>
											{t.modal.privacyPolicyLabel}
										</a>
									)
								})}
							</p>
						)}
					</div>
				</div>

				<form
					className="orejime-Modal-form"
					onSubmit={(event) => {
						event.preventDefault();
						onSave();
					}}
					onKeyDown={(event) => {
						// Prevents a bug where hitting the `Enter`
						// key on a checkbox submits the form.
						if (
							event.target.nodeName === 'INPUT'
							&& event.target.type === 'checkbox'
							&& event.key === 'Enter'
						) {
							event.preventDefault();
						}
					}}
				>
					<div className="orejime-Modal-body">{children}</div>

					<div className="orejime-Modal-footer">
						<LaraGlobalConsentActions onSave={onSave} />

						<button
							className="orejime-Button orejime-Button--save orejime-Modal-saveButton"
							title={t.modal.saveTitle}
							data-testid="orejime-modal-save"
						>
							{t.modal.save}
						</button>
					</div>

					<div>
						<PoweredByLink className="orejime-Modal-poweredByLink" />
					</div>
				</form>
			</div>
		</Dialog>
	);
};

export default Modal;
