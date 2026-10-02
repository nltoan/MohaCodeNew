/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useMemo, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { CardSection, Loading, Pagination } from '@/components';
import { Link } from 'react-router-dom';
import { vnFormatter } from '@/utils/dateUtils';
import { IconEye } from '@/components/icons';
import {
  getDocumentList,
  getDocumentArea,
  getDocumentSigner,
  getDocumentSignerTitle,
  getLegalDocumentForms,
  getLegalIssuingAuthorities,
  type DocumentFilterParams,
} from '@/services/documents';
import { getNewURL } from '@/utils/getSlugKey';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getIdFromSlug } from '@/utils/getSlugKey';
import { Helmet } from 'react-helmet-async';

interface Document {
  number: string;
  NgayBanHanh: string;
  SoKyHieu: string;
  detailUrl: string;
  ID: number;
}

interface PaginationState {
  documents: Document[];
  activePage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
}

export const LegalNormativeDocumentsPage = () => {
  const { t } = useTranslation();

  const [searchType, setSearchType] = useState<'all' | 'num' | 'desc'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [issueDateFrom, setIssueDateFrom] = useState('');
  const [issueDateTo, setIssueDateTo] = useState('');
  const [effectDateFrom, setEffectDateFrom] = useState('');
  const [effectDateTo, setEffectDateTo] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    documents: [],
    activePage: 1,
    totalPages: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const [filters, setFilter] = useState<DocumentFilterParams>({} as DocumentFilterParams);

  const { slug } = useParams<{ slug: string }>();

  const ID = getIdFromSlug(slug || '');

  const [legalDocumentForms, setLegalDocumentForms] = useState<any>([]);
  const [legalIssuingAuthorities, setLegalIssuingAuthorities] = useState<any>([]);
  const [selectedAuthority, setSelectedAuthority] = useState('');
  const [documentAreas, setDocumentAreas] = useState<any[]>([]);
  const [documentSigners, setDocumentSigners] = useState<any[]>([]);
  const [documentSignerTitles, setDocumentSignerTitles] = useState<any[]>([]);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSigner, setSelectedSigner] = useState('');
  const [selectedSignerTitle, setSelectedSignerTitle] = useState('');

  const legalIssuingAuthoritiesOptions = useMemo(
    () =>
      legalIssuingAuthorities.map((item: any) => ({
        name: item.TenCoQuanBanHanh,
        value: item.ID,
      })),
    [legalIssuingAuthorities],
  );

  const documentAreaOptions = useMemo(
    () =>
      documentAreas.map((item: any) => ({
        name: item.TenLinhVuc,
        value: item.ID,
      })),
    [documentAreas],
  );

  const documentSignerOptions = useMemo(
    () =>
      documentSigners.map((item: any) => ({
        name: item.Name,
        value: item.Name,
      })),
    [documentSigners],
  );

  const documentSignerTitleOptions = useMemo(
    () =>
      documentSignerTitles.map((item: any) => ({
        name: item.Name,
        value: item.Name,
      })),
    [documentSignerTitles],
  );

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [documentAreas, documentSigners, documentSignerTitles, legalDocumentForms, legalIssuingAuthorities] = await Promise.all([
        getDocumentArea(),
        getDocumentSigner(),
        getDocumentSignerTitle(),
        getLegalDocumentForms(),
        getLegalIssuingAuthorities(),
      ]);

      if (Array.isArray(documentAreas)) {
        setDocumentAreas(documentAreas);
      }

      if (Array.isArray(documentSigners)) {
        setDocumentSigners(documentSigners);
      }

      if (Array.isArray(documentSignerTitles)) {
        setDocumentSignerTitles(documentSignerTitles);
      }

      if (Array.isArray(legalDocumentForms)) {
        setLegalDocumentForms(legalDocumentForms);
      }

      if (Array.isArray(legalIssuingAuthorities)) {
        setLegalIssuingAuthorities(legalIssuingAuthorities);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (filters.LopVanBanID) {
        setIsLoading(true);

        try {
          const data: { data: Document[]; totalCount: number } = await getDocumentList(
            pagination.activePage,
            pagination.pageSize,
            filters,
          );

          setPagination((prev) => ({
            ...prev,
            documents: data?.data,
            totalPages: Math.ceil(data.totalCount / prev.pageSize),
            totalCount: data.totalCount,
          }));
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [filters, pagination.activePage, pagination.pageSize]);

  useEffect(() => {
    if (!ID) return;

    setFilter((prev) => ({
      ...prev,
      LopVanBanID: ID,
    }));
  }, [ID]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, activePage: 1 }));
    setFilter((prev) => ({
      ...prev,
      trichYeu: searchType === 'desc' || searchType === 'all' ? searchKeyword : '',
      soKyHieu: searchType === 'num' || searchType === 'all' ? searchKeyword : '',
      coQuanBanHanhId: selectedAuthority,
      linhVucId: selectedArea,
      nguoiKy: selectedSigner,
      chucDanhKy: selectedSignerTitle,
      ngayBanHanhFrom: issueDateFrom ? String(issueDateFrom) : undefined,
      ngayBanHanhTo: issueDateTo ? String(issueDateTo) : undefined,
      ngayHieuLucFrom: effectDateFrom,
      ngayHieuLucTo: effectDateTo,
    }));
  };

  const toggleAdvancedSearch = () => {
    setShowAdvanced((prev) => !prev);
  };

  if (isLoading) {
    return <Loading />;
  }

  const SearchRadioGroup = ({ prefix }: { prefix: string }) => (
    <Form.Group className="form-group-radios">
      <Form.Label as="span">{t('documents.search.keyword_label')}</Form.Label>
      <Form.Check
        type="radio"
        label={t('documents.type.all')}
        name={`${prefix}Type`}
        id={`${prefix}All`}
        checked={searchType === 'all'}
        onChange={() => setSearchType('all')}
        className="form-check"
      />
      <Form.Check
        type="radio"
        label={t('documents.type.enum')}
        name={`${prefix}Type`}
        id={`${prefix}Num`}
        checked={searchType === 'num'}
        onChange={() => setSearchType('num')}
        className="form-check"
      />
      <Form.Check
        type="radio"
        label={t('documents.type.desc')}
        name={`${prefix}Type`}
        id={`${prefix}Desc`}
        checked={searchType === 'desc'}
        onChange={() => setSearchType('desc')}
        className="form-check"
      />
    </Form.Group>
  );

  return (
    <>
      <Helmet>
        <title>{t('seo.legal')}</title>
      </Helmet>
      <h1 className="visually-hidden">{t('documents.list.title')}</h1>
      <div className="mh-document-filter">
        <div className="mh-document-filter-basic" style={{ display: showAdvanced ? 'none' : 'block' }}>
          <SearchRadioGroup prefix="rdBasic" />
          <div className="mh-document-filter-basic-body">
            <Form.Control
              type="search"
              placeholder={t('documents.search.keyword_placeholder')}
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button type="button" className="mh-document-btn primary" onClick={handleSearch}>
              {t('documents.search.search')}
            </button>
            <button type="button" className="mh-document-btn" onClick={toggleAdvancedSearch}>
              {t('documents.search.advanced_search')}
            </button>
          </div>
        </div>

        <div className="mh-document-filter-advanced" style={{ display: showAdvanced ? 'block' : 'none' }}>
          <Row>
            <Col lg={12} md={12} xl={6}>
              <SearchRadioGroup prefix="rdAdvance" />
              <Form.Control
                type="search"
                placeholder={t('documents.search.keyword_placeholder')}
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="mb-3"
              />
            </Col>

            {/*---- Nhom Van Ban ----*/}
            {/* <Col lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t("documents.group.label")}</Form.Label>
                <Form.Control
                  type="search"
                  placeholder={t("documents.group.placeholder")}
                  value={groupKeyword}
                  onChange={(e) => setGroupKeyword(e.target.value)}
                />
              </Form.Group>
            </Col> */}

            {/*---- Tinh trang van ban ----*/}
            {/* <Col xl={3} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t("documents.effect_status.label")}</Form.Label>
                <Form.Select value={effectStatus} onChange={(e) => setEffectStatus(e.target.value)}>
                  <option value="">{t("documents.effect_status.all")}</option>
                </Form.Select>
              </Form.Group>
            </Col> */}

            {/*---- Loai Van ban ----*/}
            <Col xl={3} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t('documents.area.label')}</Form.Label>
                <Form.Select
                  value={selectedArea}
                  onChange={(e) => {
                    setSelectedArea(e.target.value);
                  }}
                >
                  <option value="">{t('documents.area.all')}</option>
                  {documentAreaOptions.map((item: any) => {
                    return (
                      <option value={item.value} key={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>

            {/*---- Cap ban hanh ----*/}
            {/* <Col xl={3} lg={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t("documents.issue_level.label")}</Form.Label>
                <Form.Select value={issueLevel} onChange={(e) => setIssueLevel(e.target.value)}>
                  <option value="">{t("documents.issue_level.all")}</option>
                  {legalIssuingAuthoritiesOptions.map((item: any) => {
                    return <option value={item.value} key={item.value}>{item.name}</option>
                  })}
                </Form.Select>
              </Form.Group>
            </Col> */}

            {/*---- Co quan ban hanh ----*/}
            <Col xl={3} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t('documents.issue_agency.label')}</Form.Label>
                <Form.Select value={selectedAuthority} onChange={(e) => setSelectedAuthority(e.target.value)}>
                  <option value="">{t('documents.issue_agency.all')}</option>
                  {legalIssuingAuthoritiesOptions.map((item: any) => {
                    return (
                      <option value={item.value} key={item.ID}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            {/*---- Nguoi ky ----*/}
            <Col xl={6} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t('documents.signer.label')}</Form.Label>
                <Form.Select
                  value={selectedSigner}
                  onChange={(e) => {
                    setSelectedSigner(e.target.value);
                  }}
                >
                  <option value="">{t('documents.signer.all')}</option>
                  {documentSignerOptions.map((item: any) => {
                    return (
                      <option value={item.value} key={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
            {/*---- chuc danh ky ----*/}
            <Col xl={6} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t('documents.signertitle.label')}</Form.Label>
                <Form.Select
                  value={selectedSignerTitle}
                  onChange={(e) => {
                    setSelectedSignerTitle(e.target.value);
                  }}
                >
                  <option value="">{t('documents.signertitle.all')}</option>
                  {documentSignerTitleOptions.map((item: any) => {
                    return (
                      <option value={item.value} key={item.value}>
                        {item.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xl={3} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t('documents.issue_date.label')}</Form.Label>
                <div className="form-control-date">
                  <Form.Control
                    type="date"
                    placeholder={t('documents.issue_date.from')}
                    value={issueDateFrom}
                    onChange={(e) => setIssueDateFrom(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>

            <Col xl={3} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label"></Form.Label>
                <div className="form-control-date">
                  <Form.Control
                    type="date"
                    placeholder={t('documents.issue_date.to')}
                    value={issueDateTo}
                    onChange={(e) => setIssueDateTo(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>

            <Col xl={3} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label">{t('documents.effect_date.label')}</Form.Label>
                <div className="form-control-date">
                  <Form.Control
                    type="date"
                    placeholder={t('documents.effect_date.from')}
                    value={effectDateFrom}
                    onChange={(e) => setEffectDateFrom(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>

            <Col xl={3} lg={6} md={6}>
              <Form.Group className="mb-3">
                <Form.Label className="form-label"></Form.Label>
                <div className="form-control-date">
                  <Form.Control
                    type="date"
                    placeholder={t('documents.effect_date.to')}
                    value={effectDateTo}
                    onChange={(e) => setEffectDateTo(e.target.value)}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          <div className="mh-document-filter-actions">
            <button type="button" className="mh-document-btn" onClick={toggleAdvancedSearch}>
              {t('documents.search.close')}
            </button>
            <button type="button" className="mh-document-btn primary" onClick={handleSearch}>
              {t('documents.search.search')}
            </button>
          </div>
        </div>
      </div>

      <Row>
        <Col xl={9} className="order-1 order-xl-2">
          <div className="mh-document-content">
            <CardSection
              title={t('documents.list.title')}
              headerAdditional={
                <span>
                  {t('documents.list.total')}: <b>{pagination.totalCount}</b>
                </span>
              }
            >
              <div className="mh-document-items">
                {(pagination.documents || []).map((item, idx) => (
                  <div className="mh-document-item" key={idx}>
                    <div className="mh-document-item-name">
                      <strong>{item.number}</strong>
                      <span>
                        {t('documents.list.issued_date')} <br />
                        {vnFormatter(item.NgayBanHanh) ?? '-'}
                      </span>
                    </div>
                    <div className="mh-document-item-info">
                      <Link to={getNewURL('van-ban', item.SoKyHieu, item.ID)} className="mh-document-item-title">
                        {item.SoKyHieu}
                      </Link>
                    </div>
                    <Link to={getNewURL('van-ban', item.SoKyHieu, item.ID)} className="mh-document-item-action">
                      <IconEye />
                      <span>{t('documents.list.view_document')}</span>
                    </Link>
                  </div>
                ))}
                {pagination.documents.length === 0 && <div className="text-center">{t('common.no_data')}</div>}
              </div>
              {pagination.totalPages >= 1 && (
                <Pagination
                  style={{ marginTop: 10 }}
                  showPageSizeSelector
                  totalPages={pagination.totalPages}
                  activePage={pagination.activePage}
                  pageSize={pagination.pageSize}
                  onPageChange={(page) => {
                    setPagination((prev) => ({ ...prev, activePage: page }));
                  }}
                  onPageSizeChange={(size) => {
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: size,
                      activePage: 1,
                    }));
                  }}
                  maxVisiblePages={3}
                  wrapStyle={{ marginBottom: 48 }}
                />
              )}
            </CardSection>
          </div>
        </Col>

        <Col xl={3} className="order-2 order-xl-1">
          <div className="mh-document-sidebar">
            <CardSection title={t('documents.sidebar.document_type')}>
              <div className="mh-document-types">
                {legalDocumentForms.map((form: any) => (
                  <Link
                    to=""
                    key={form.ID}
                    onClick={() =>
                      setFilter((prev) => ({
                        ...prev,
                        hinhThucVanBanId: form.ID,
                      }))
                    }
                  >
                    {form.TenHinhThucVanBan}
                  </Link>
                ))}
              </div>
            </CardSection>
          </div>
        </Col>
      </Row>
    </>
  );
};
