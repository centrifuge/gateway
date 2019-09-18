import { getFundingStatus, FUNDING_STATUS } from '../status';


describe('Funding Status', () => {

  it('Should return NO_STATUS', function() {
    const invoice = {};
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.NO_STATUS);
  });

  it('Should return PENDING', function() {
    const invoice = {
      fundingAgreement: {},
    };
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.PENDING);
  });

  it('Should return ACCEPTED', function() {
    const invoice = {
      fundingAgreement: {
        signatures: [{}],
      },
    };
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.ACCEPTED);
  });

  it('Should return SENDING_FUNDING', function() {
    const invoice = {
      fundingAgreement: {
        signatures: [{}],
      },
      transferDetails: [
        { status: 'opened' }
      ],
    };
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.SENDING_FUNDING);
  });

  it('Should return FUNDED', function() {
    const invoice = {
      fundingAgreement: {
        signatures: [{}],
      },
      transferDetails: [
        { status: 'settled' }
      ],
    };
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.FUNDED);
  });


  it('Should return REPAYING_FUNDING', function() {
    const invoice = {
      fundingAgreement: {
        signatures: [{}],
      },
      transferDetails: [
        { status: 'settled' },
        { status: 'opened' },
      ],
    };
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.REPAYING_FUNDING);
  });

  it('Should return REPAID', function() {
    const invoice = {
      fundingAgreement: {
        signatures: [{}],
      },
      transferDetails: [
        { status: 'settled' },
        { status: 'settled' },
      ],
    };
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.REPAID);
  });

  it('Should return UNKNOWN', function() {
    const invoice = {
      fundingAgreement: {
        signatures: [{}],
      },
      transferDetails: [
        { status: 'UNKNOWN' },
        { status: 'UNKNOWN' },
      ],
    };
    expect(getFundingStatus(invoice)).toBe(FUNDING_STATUS.UNKNOWN);
  });

});
